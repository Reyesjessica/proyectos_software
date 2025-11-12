//! Smart contract para registrar proyectos comunitarios en Comunicahain
use soroban_sdk::{contractimpl, Address, Env, Symbol, Vec};

#[derive(Clone)]
pub struct Project {
    pub name: Symbol,
    pub progress: Symbol,
    pub budget: Symbol,
    pub owner: Address,
    pub timestamp: u64,
}

pub struct CommunityProjectsContract;

#[contractimpl]
impl CommunityProjectsContract {
    pub fn add_project(
        env: Env,
        name: Symbol,
        progress: Symbol,
        budget: Symbol,
        owner: Address,
    ) {
        let mut projects: Vec<Project> = env.storage().get(&"projects").unwrap_or(Vec::new(&env));
        let timestamp = env.ledger().timestamp();
        let project = Project {
            name,
            progress,
            budget,
            owner,
            timestamp,
        };
        projects.push_back(project);
        env.storage().set(&"projects", &projects);
    }

    pub fn list_projects(env: Env) -> Vec<Project> {
        env.storage().get(&"projects").unwrap_or(Vec::new(&env))
    }
}
