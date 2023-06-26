module.exports = (opts = {}) => {
    return {
      postcssPlugin: 'tailwindcss-dynamicvars',
      Rule (rule) {
        const match = rule.selector.match(/\$\\\{([a-zA-Z0-9]+)\\\}/);
        if(match){
          const varname = match?.[1];
          const sel = rule.selector;
          if(opts?.ranges?.[varname] || (opts?.default?.range && !opts?.values?.[varname])){
            const [startRange = 0, endRange = 10] = opts?.ranges?.[varname] || opts?.default?.range;
            const newSelectors = Array(endRange - startRange).fill(undefined).map((_, i) => 
              sel.replaceAll(`\\$\\{${varname}\\}`, i + startRange)
            )
            rule.selector = newSelectors.join(", ");
          } else if(opts?.values?.[varname] || opts?.default?.values){
            const values = opts?.values?.[varname] || opts?.default?.values
            const newSelectors = values?.map((v) => sel.replaceAll(`\\$\\{${varname}\\}`, v))
            rule.selector = newSelectors.join(", ");
          }
        }
      }
    }
  }
  module.exports.postcss = true
