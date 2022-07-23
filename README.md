### Byte Storage on the Blockchain

while ethereum and blockchains are specifically designed to make it hard to store data on them, I wanted to design this as a proof of concept of uploading a file to a chain to experiment with on other chains that are less expensive on gas

### To-Do

- [ ] Fix bug where you need a file to exist to estimate gas, too large files don't work for some reason (add this to contract constructor?)
- [ ] Set up 2d byte32 arrays for large files in contract
- [ ] Figure out optimal transaction size for gas & file storage
- [ ] Make frontend for viewing files in contract by name, listing available ones
- [ ] Make gui for uploading files and showing estimated gas cost 
- [ ] Audit contract security, only allow approved addition / removal, etc
- [ ] Check for existing file names in contract
- [ ] Add a password hash or something to protect anyone adding files to contract