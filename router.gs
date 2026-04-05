// router.gs
var Router = {
  dispatch(payload) {
    // Gunakan payload.label sesuai arahan mentor
    Logger.log(`[ROUTER] Processing event from: ${payload.label}`);
    
    const matched = RULES.filter(rule => {
      try {
        return new Function('payload', `return (${rule.when})`)(payload);
      } catch (e) { return false; }
    });

    if (matched.length === 0) {
      Logger.log("⚠️ No rule matched for label: " + payload.label);
      return;
    }

    matched.forEach(rule => {
      Logger.log(`▶ Executing Rule: ${rule.id}`);
      rule.execute.forEach(handlerName => {
        if (typeof Handlers[handlerName] === 'function') {
          Handlers[handlerName](payload);
        }
      });
    });
  }
};