const eventsrc = new EventSource('http://localhost:2468/stream-messages')
const btnEl = document.querySelector('.send')
const msgEl = document.querySelector('.message')
const numEl = document.querySelector('.number')
const clrLogEl = document.querySelector('.clear-log')
const clrLogOldestEl = document.querySelector('.clear-log-oldest')
const clrLogNewestEl = document.querySelector('.clear-log-newest')
const converter = new showdown.Converter()


eventsrc.onmessage = (event) => {

  const data = JSON.parse(event.data)
  addLogEntry(data.message ?? event.data)

}

function ask(msg) {
  const body = JSON.stringify({
    object: 'page',
    entry: [
      {
        messaging: [
          {
            sender: {
              id: Number(numEl.value) //|| 8297504716950349
            },
            message: {
              text: msgEl.value || '!id'
            }
                }
              ]
            }
          ]
  })
  try {
    const post = fetch("http://localhost:3000/generative-ai/api/v1/webhook", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })

    post
      .then(e => {
        if (e.status >= 400 && e.status <= 511)
          addLogEntry(`Received error code: ${e.status} - ${e.statusText}`, 'warning')
      })
      .catch(e => {
        console.log({ error: e })
        addLogEntry("message was not sent", 'error')
      })
  } catch (e) {
    addLogEntry("message was not sent", 'error')
    console.log(e)
  }
}

const logContainer = document.getElementById('log-container');


function addLogEntry(message, type = 'info') {
  const logEntry = document.createElement('div');
  logEntry.classList.add('log-entry', `log-${type}`);
  logEntry.innerHTML = `<div class="card mb-3 p-3"><span>time: ${new Date().toJSON()}</span></div>` + converter.makeHtml(message).replace(/\n/gi,'<br>')
  logContainer.appendChild(logEntry);

  // Auto-scroll to the bottom
  logContainer.scrollTop = logContainer.scrollHeight;
}

btnEl.addEventListener('click', () => {
  if (!msgEl.value && msgEl.value === '')
    return;

  ask(msgEl.value)
})

function clearLog() {
  
  const logs = document.querySelectorAll('.log-entry')
  if (logs.length === 0)
    return;
    
  for(logEntry of logs) {
    logEntry.remove()
  }
  
}

function clearLogOldest() {
  
  const log = document.querySelector('.log-entry')
  if(!log)
    return;
  log.remove()
  
}

function clearLogNewest() {
  
  const logs = document.querySelectorAll('.log-entry')
  if(logs.length === 0)
    return;
  const log = logs[logs.length-1]
  log.remove()
  
}

clrLogOldestEl.addEventListener('click', clearLogOldest)
clrLogNewestEl.addEventListener('click', clearLogNewest)
clrLogEl.addEventListener('click',clearLog)

