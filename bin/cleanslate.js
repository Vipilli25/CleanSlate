#!/usr/bin/env node  

// “When this file is run from the command line, use node to run it.”
// Why /usr/bin/env and not just /usr/bin/node?
//  /usr/bin/env is more portable across systems:
// env finds node in the user's $PATH, which works on Linux, macOS, and environments where Node isn't in a fixed location.

require('../src/cli');
