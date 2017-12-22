
function initialiseUI() {

  fetch('/api/subscriptions', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "GET",
})
  .then((response) => {
    if (response.status !== 200) {
      return response.text()
      .then((responseText) => {
        throw new Error(responseText);
      });
    }
  });

}



function registerSubscription(subscription){

    let p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh'))))
    let auth = btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
    let  endpoint = subscription.endpoint;
    fetch('/subscriptions/send-push-msg?endpoint='+endpoint+'&p256dh='+encodeURIComponent(p256dh)+'&auth='+encodeURIComponent(auth), {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            endpoint: endpoint,
            p256dh : p256dh ,
            auth: auth
        })
    })
      .then((response) => {
        if (response.status !== 200) {
          return response.text()
          .then((responseText) => {
            throw new Error(responseText);
          });
        }
      });

}

window.addEventListener('load', () => {
    initialiseUI();
  });