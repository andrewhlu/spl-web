const currentGitBranchName = require("current-git-branch");

module.exports = {
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname,
        GIT_BRANCH: currentGitBranchName()
    }
};
