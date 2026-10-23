(() => {
  const observer = new MutationObserver(() => {
    const uri = document.querySelector('#mongo-uri');
    if (uri && !uri.dataset.atlasReady) {
      uri.dataset.atlasReady = '1';
      uri.value = 'mongodb+srv://<atlas-cluster>/<bpo_system>';
      uri.placeholder = 'mongodb+srv://<atlas-cluster>/<bpo_system>';
    }
    const connect = document.querySelector('[data-action="connect-db"]');
    if (connect && !connect.dataset.atlasReady) {
      connect.dataset.atlasReady = '1';
      connect.addEventListener('click', () => {
        const error = document.querySelector('#connection-error');
        if (error) error.textContent = 'Atlas credentials are kept in Vercel environment variables. This browser UI never stores or uploads the connection secret.';
      }, true);
    }
  });
  observer.observe(document.body, {childList:true, subtree:true});
})();
