const utils = {
  getRepoDirectory: (name, branch) => `repo/${name}_${branch.replace('/', '')}`,
};

export { utils };
