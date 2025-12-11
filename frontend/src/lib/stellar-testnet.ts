/**
 * Stellar Testnet Service
 * Handles storing project data on Stellar testnet
 */

'use client';

const STELLAR_HORIZON_URL = 'https://horizon-testnet.stellar.org';
const STELLAR_NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

interface Project {
    name: string;
    description?: string;
    location?: string;
    progress: string;
    budget: string;
}

interface StellarKeypair {
    publicKey: string;
    secretKey: string;
}

/**
 * Get the keypair for a user from localStorage
 */
export function getUserKeypair(username: string): StellarKeypair | null {
    if (typeof window === 'undefined') return null;

    const walletRaw = localStorage.getItem(`stellar-wallet-${username}`);
    if (!walletRaw) return null;

    try {
        const walletData = JSON.parse(walletRaw);
        return {
            publicKey: walletData.publicKey,
            secretKey: atob(walletData.secret)
        };
    } catch {
        return null;
    }
}

/**
 * Fund an account on testnet using Friendbot
 */
export async function fundAccountOnTestnet(publicKey: string): Promise<boolean> {
    try {
        const response = await fetch(
            `https://friendbot.stellar.org?addr=${publicKey}`
        );

        if (response.ok) {
            console.log('✅ Account funded on testnet:', publicKey);
            return true;
        }

        // Account might already be funded
        if (response.status === 400) {
            console.log('ℹ️ Account already funded or exists');
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error funding account:', error);
        return false;
    }
}

/**
 * Check if an account exists on the network
 */
export async function accountExists(publicKey: string): Promise<boolean> {
    try {
        const response = await fetch(`${STELLAR_HORIZON_URL}/accounts/${publicKey}`);
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Serialize projects data for storage
 * Stellar data entries have a 64-byte limit per value, so we store a hash/reference
 */
function serializeProjects(projects: Project[]): string {
    // Store a compact JSON representation
    const compact = projects.map(p => ({
        n: p.name.substring(0, 30),
        d: (p.description || "").substring(0, 50),
        l: (p.location || "").substring(0, 30),
        p: p.progress,
        b: p.budget.substring(0, 15)
    }));
    return JSON.stringify(compact);
}

/**
 * Deserialize projects data from storage
 */
function deserializeProjects(data: string): Project[] {
    try {
        const compact = JSON.parse(data);
        return compact.map((p: any) => ({
            name: p.n || p.name || '',
            description: p.d || p.description || '',
            location: p.l || p.location || '',
            progress: p.p || p.progress || '0',
            budget: p.b || p.budget || '$0'
        }));
    } catch {
        return [];
    }
}

/**
 * Save projects to Stellar testnet using manage_data operation
 */
/**
 * Helper to build the transaction operations
 */
function createProjectsTransaction(
    account: any,
    projects: Project[],
    StellarSdk: any,
    paymentAmount: string = '0',
    memoText: string = '',
    destinationAddress: string = ''
): any {
    // Serialize projects data
    const projectsData = serializeProjects(projects);

    // Split data into chunks of 64 bytes if necessary
    const chunks = [];
    for (let i = 0; i < projectsData.length; i += 60) {
        chunks.push(projectsData.substring(i, i + 60));
    }

    // Build transaction with manage_data operations
    let transactionBuilder = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_NETWORK_PASSPHRASE
    });

    // Add Memo if present
    if (memoText) {
        try {
            const safeMemo = memoText.substring(0, 28);
            transactionBuilder.addMemo(StellarSdk.Memo.text(safeMemo));
        } catch (e) {
            console.warn("Could not add memo", e);
        }
    }

    // 1. Add Payment Operation (allocating budget)
    if (paymentAmount && paymentAmount !== '0') {
        try {
            // If destination provided, use it. Otherwise loopback to self.
            const dest = destinationAddress || account.accountId();

            transactionBuilder = transactionBuilder.addOperation(
                StellarSdk.Operation.payment({
                    destination: dest,
                    asset: StellarSdk.Asset.native(),
                    amount: paymentAmount
                })
            );
        } catch (e) {
            console.warn("Invalid payment amount, skipping payment op", e);
        }
    }

    // Clear old project data first - REMOVED to avoid MANAGE_DATA_NOT_FOUND error
    // We rely on overwriting and the 'project_count' logic to ignore old keys.
    /* 
    for (let i = 0; i < 10; i++) {
        transactionBuilder = transactionBuilder.addOperation(
            StellarSdk.Operation.manageData({
                name: `project_${i}`,
                value: null
            })
        );
    }
    */

    // Add project count
    // Use Buffer.from for strict encoding
    transactionBuilder = transactionBuilder.addOperation(
        StellarSdk.Operation.manageData({
            name: 'project_count',
            value: Buffer.from(chunks.length.toString())
        })
    );

    // Add project data chunks
    chunks.forEach((chunk, index) => {
        transactionBuilder = transactionBuilder.addOperation(
            StellarSdk.Operation.manageData({
                name: `project_${index}`,
                value: Buffer.from(chunk)
            })
        );
    });

    return transactionBuilder.setTimeout(60).build();
}

/**
 * Save projects to Stellar testnet using manage_data operation (Local Keypair)
 */
export async function saveProjectsToStellar(
    username: string,
    projects: Project[],
    paymentAmount: string = '0'
): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
        const keypair = getUserKeypair(username);
        if (!keypair) {
            return { success: false, error: 'No wallet found for user' };
        }

        // Dynamic import to avoid SSR issues
        const StellarSdk = await import('@stellar/stellar-sdk');

        // Check if account exists, fund if not
        const exists = await accountExists(keypair.publicKey);
        if (!exists) {
            console.log('Creating account on testnet...');
            const funded = await fundAccountOnTestnet(keypair.publicKey);
            if (!funded) {
                return { success: false, error: 'Could not fund account on testnet' };
            }
            // Wait for account to be created (increased to 5s)
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        // Get account details
        const server = new StellarSdk.Horizon.Server(STELLAR_HORIZON_URL);
        const account = await server.loadAccount(keypair.publicKey);

        // Build transaction
        const transaction = createProjectsTransaction(account, projects, StellarSdk);

        // Sign the transaction
        const sourceKeypair = StellarSdk.Keypair.fromSecret(keypair.secretKey);
        transaction.sign(sourceKeypair);

        // Submit to network
        const result = await server.submitTransaction(transaction);

        console.log('✅ Projects saved to Stellar testnet:', result.hash);

        return {
            success: true,
            txHash: result.hash
        };
    } catch (error: any) {
        console.error('Error saving to Stellar:', error);
        return {
            success: false,
            error: error.message || 'Unknown error saving to Stellar'
        };
    }
}

/**
 * Save projects using Freighter Wallet
 */
export async function saveProjectsWithFreighter(
    publicKey: string,
    projects: Project[],
    paymentAmount: string = '0',
    memoText: string = '',
    destinationAddress: string = ''
): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
        const freighterApi = await import('@stellar/freighter-api');
        const StellarSdk = await import('@stellar/stellar-sdk');

        // Check if account exists
        const exists = await accountExists(publicKey);
        if (!exists) {
            console.log('Funding Freighter account on testnet...');
            const funded = await fundAccountOnTestnet(publicKey);
            if (!funded) {
                return { success: false, error: 'Could not fund Freighter account on testnet. Please fund it manually.' };
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        const server = new StellarSdk.Horizon.Server(STELLAR_HORIZON_URL);
        const account = await server.loadAccount(publicKey);

        // Build transaction
        // Build transaction
        const transaction = createProjectsTransaction(account, projects, StellarSdk, paymentAmount, memoText, destinationAddress);
        const xdr = transaction.toXDR();

        // Sign with Freighter
        const signResult = await freighterApi.signTransaction(xdr, {
            networkPassphrase: STELLAR_NETWORK_PASSPHRASE
        });

        if (!signResult) {
            return { success: false, error: 'User rejected transaction in Freighter' };
        }

        // Recover transaction from signed XDR and submit
        const resultAny = signResult as any;
        const signedTxXdr = resultAny.signedTxXdr ? resultAny.signedTxXdr : resultAny;
        const tx = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr as string, STELLAR_NETWORK_PASSPHRASE);
        const result = await server.submitTransaction(tx);

        console.log('✅ Projects saved via Freighter:', result.hash);

        return { success: true, txHash: result.hash };

    } catch (error: any) {
        console.error('Error saving with Freighter:', error);
        return {
            success: false,
            error: error.message || 'Unknown error with Freighter'
        };
    }
}

/**
 * Load projects from Stellar testnet
 */
/**
 * Load projects from a specific Stellar account
 */
export async function loadProjectsFromAccount(
    publicKey: string
): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
    try {
        // Check if account exists
        const exists = await accountExists(publicKey);
        if (!exists) {
            return { success: true, projects: [] };
        }

        // Get account details
        const response = await fetch(`${STELLAR_HORIZON_URL}/accounts/${publicKey}`);
        if (!response.ok) {
            return { success: false, error: 'Could not load account' };
        }

        const accountData = await response.json();
        const dataEntries = accountData.data || {};

        // Get project count
        const countEncoded = dataEntries['project_count'];
        if (!countEncoded) {
            return { success: true, projects: [] };
        }

        const count = parseInt(atob(countEncoded), 10);

        // Reconstruct project data from chunks
        let projectsData = '';
        for (let i = 0; i < count; i++) {
            const chunkEncoded = dataEntries[`project_${i}`];
            if (chunkEncoded) {
                projectsData += atob(chunkEncoded);
            }
        }

        if (!projectsData) {
            return { success: true, projects: [] };
        }


        const projects = deserializeProjects(projectsData);
        console.log(`✅ Projects loaded from Stellar testnet: ${projects.length} (Count: ${count})`);
        console.log('Keys used:', Object.keys(dataEntries).filter(k => k.startsWith('project_')));

        return { success: true, projects };
    } catch (error: any) {
        console.error('Error loading from Stellar:', error);
        return {
            success: false,
            error: error.message || 'Unknown error loading from Stellar'
        };
    }
}

/**
 * Load projects from Stellar testnet (Local Keypair)
 */
export async function loadProjectsFromStellar(
    username: string
): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
    const keypair = getUserKeypair(username);
    if (!keypair) {
        return { success: false, error: 'No wallet found for user' };
    }
    return loadProjectsFromAccount(keypair.publicKey);
}

/**
 * Fund a project (Send Payment) using local keypair
 */
export async function fundProject(
    username: string,
    destinationAddress: string,
    amount: string,
    memo: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
        const keypair = getUserKeypair(username);
        if (!keypair) return { success: false, error: 'No wallet found' };

        const StellarSdk = await import('@stellar/stellar-sdk');
        const server = new StellarSdk.Horizon.Server(STELLAR_HORIZON_URL);
        const sourceKeys = StellarSdk.Keypair.fromSecret(keypair.secretKey);

        const account = await server.loadAccount(keypair.publicKey);

        let transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: STELLAR_NETWORK_PASSPHRASE
        })
            .addOperation(StellarSdk.Operation.payment({
                destination: destinationAddress,
                asset: StellarSdk.Asset.native(),
                amount: amount
            }));

        if (memo) {
            const safeMemo = memo.substring(0, 28);
            transaction = transaction.addMemo(StellarSdk.Memo.text(safeMemo));
        }

        const builtTx = transaction.setTimeout(30).build();
        builtTx.sign(sourceKeys);

        const result = await server.submitTransaction(builtTx);
        console.log('✅ Funding sent:', result.hash);
        return { success: true, txHash: result.hash };
    } catch (e: any) {
        return { success: false, error: e.message || "Error funding project" };
    }
}

/**
 * Fund a project using Freighter
 */
export async function fundProjectWithFreighter(
    destinationAddress: string,
    amount: string,
    memo: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
        const freighterApi = await import('@stellar/freighter-api');
        const StellarSdk = await import('@stellar/stellar-sdk');
        const { address } = await freighterApi.getAddress();

        const server = new StellarSdk.Horizon.Server(STELLAR_HORIZON_URL);
        const account = await server.loadAccount(address);

        // Check if destination exists
        const destExists = await accountExists(destinationAddress);
        let transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: STELLAR_NETWORK_PASSPHRASE
        });

        if (destExists) {
            // Normal payment
            transaction.addOperation(StellarSdk.Operation.payment({
                destination: destinationAddress,
                asset: StellarSdk.Asset.native(),
                amount: amount
            }));
        } else {
            // Destination empty? Must use Create Account
            console.log("ℹ️ Destination inactive, using createAccount operation");

            // VALIDATION: Create Account requires at least 1 XLM
            if (parseFloat(amount) < 1) {
                return {
                    success: false,
                    error: "La cuenta de destino es nueva. Debes enviar al menos 1 XLM para activarla."
                };
            }

            transaction.addOperation(StellarSdk.Operation.createAccount({
                destination: destinationAddress,
                startingBalance: amount
            }));
        }

        if (memo) {
            const safeMemo = memo.substring(0, 28);
            transaction = transaction.addMemo(StellarSdk.Memo.text(safeMemo));
        }

        const xdr = transaction.setTimeout(30).build().toXDR();
        const signResult = await freighterApi.signTransaction(xdr, {
            networkPassphrase: STELLAR_NETWORK_PASSPHRASE
        });

        if (!signResult) return { success: false, error: 'User rejected funding' };

        // Force cast to handle both string and object returns
        const resultAny = signResult as any;
        const signedTxXdr = resultAny.signedTxXdr ? resultAny.signedTxXdr : resultAny;
        const tx = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr as string, STELLAR_NETWORK_PASSPHRASE);
        try {
            const result = await server.submitTransaction(tx);
            console.log('✅ Funding sent via Freighter:', result.hash);
            return { success: true, txHash: result.hash };
        } catch (submitError: any) {
            console.error("🔴 Submit Error:", submitError);

            // Try to extract useful Stellar error codes
            if (submitError.response?.data?.extras?.result_codes) {
                const codes = submitError.response.data.extras.result_codes;
                const opCodes = codes.operations ? codes.operations.join(', ') : '';
                return {
                    success: false,
                    error: `Error de Stellar: ${codes.transaction} ${opCodes}`
                };
            }

            // Handle the specific 'e.switch' crash which often masks a standard error
            if (submitError.message && submitError.message.includes('switch')) {
                return {
                    success: false,
                    error: "Error interno de Stellar (Probablemente 'Account Exists' o 'Low Reserve'). Intenta recargar la página."
                };
            }

            return { success: false, error: submitError.message || "Error enviando transacción" };
        }
    } catch (e: any) {
        return { success: false, error: e.message || "Error general con Freighter" };
    }
}

/**
 * Get Stellar Explorer URL for a transaction
 */
export function getStellarExplorerUrl(txHash: string): string {
    return `https://stellar.expert/explorer/testnet/tx/${txHash}`;
}

/**
 * Get account explorer URL
 */
export function getAccountExplorerUrl(publicKey: string): string {
    return `https://stellar.expert/explorer/testnet/account/${publicKey}`;
}
