

const apiTest = () => {
  fetch("/webapi/aaa").then(res=>res.json()).then(resp => {
    console.log("/api/list get resp:", resp);
    if (document.querySelector?.('#getReq')) {
      document.querySelector('#getReq').innerText = '/api/list get OK. resp:'+JSON.stringify(resp);
    }
  }).finally(async () => {
    fetch("/api/test",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({})
    }).then(res=>res.json()).then(resp => {
      console.log("/api/test POST resp:", resp);
      if (document.querySelector('#postReq')) {
        document.querySelector('#postReq').innerText = '/api/test POST OK. resp:'+JSON.stringify(resp);
      }
    }).finally(() => {
      console.log("mock api test end 666");
      // if (document.querySelector?.('#message'))
      document.querySelector('#message').innerText = 'mock api test end ';
    });


    await fetch("/api/list",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({})
    }).then(res=>res.json()).then(resp => {
      console.log("/api/list POST resp:", resp);
      if (document.querySelector('#postReq')) {
        document.querySelector('#postReq').innerText = '/api/list POST OK. resp:'+JSON.stringify(resp);
      }
    }).finally(() => {
      console.log("mock api list end 666");
      // if (document.querySelector?.('#message'))
      document.querySelector('#errorMessage').innerText = 'mock api list end ';
    });
  });
}
apiTest();
