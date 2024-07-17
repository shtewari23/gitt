// types.ts

export interface Repository {
    id: number;
    name: string;
    description: string;
    stargazers_count: number;
    updated_at: string;
  }
  
  export interface Commit {
    sha: string;
    commit: {
      message: string;
      author: {
        name: string;
        date: string;
      };
    };
  }
  