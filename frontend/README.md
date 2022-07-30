### Storage Dapp Frontend

This is the front end to access downloading files from the chain.

Uses ethers.js 

### Todo

- [ ] ***Add a link for each upload transaction after it's sent, with a link to retry if it fails
- [x] Add better wallet setup, automatic chain detection, more wallets than metamask, etc. (Take from testsite repo)
- [x] Add routing to an upload page
- [ ] Hash the content of the file and use it as file name on chain and reference - provide list of filenames for easy access
- [ ] Store file names as hashes on chain - still allow custom file names and extensions ???
- [ ] Create a UI using 2d array of boxes to visualize storage method of files
- [ ] Properly use resolvers and promises for serving transactions for uploading
- [ ] Further separate into components
- [ ] Fix the gross current state management
- [ ] Make the frontend more pretty