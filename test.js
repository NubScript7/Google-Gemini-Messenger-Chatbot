const axios = require("axios")

async function main() {
    const response1 = await axios({
      method: 'get',
      url: 'https://www.google.com',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Upgrade-Insecure-Requests': '1',
      }
    })
    
    
    const response2 = await axios({
      method: 'get',
      url: 'https://www.google.com'
    })
    
    
    console.log(response1)
    console.log(response2)
    
}

main()