const Router = {
  dispatch(payload) {
    Logger.log(`[ROUTER] Processing event from: ${payload.source}`);
    
    const matched = RULES.filter(rule => {
      try {
        return new Function('payload', `return (${rule.when})`)(payload);
      } catch (e) { return false; }
    });

    matched.forEach(rule => {
      Logger.log(`[RULE] Executing: ${rule.id}`);
      rule.execute.forEach(handlerName => {
        if (Handlers[handlerName]) {
          // Payload Reference: dilempar ke pipeline
          Handlers[handlerName](payload);
        }
      });
    });
  }
};