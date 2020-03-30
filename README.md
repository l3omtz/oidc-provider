# oidc-provider

> A react provider for oidc client

[![NPM](https://img.shields.io/npm/v/oidc-provider.svg)](https://www.npmjs.com/package/oidc-provider) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save oidc-provider
```

## Usage

```tsx
import * as React from 'react'

import { AuthProvider } from 'oidc-provider'

class Example extends React.Component {
  render () {
    return (
      <AuthProvider authConfig={authConfig}>
        <BrowserRouter children={Routes} basename={"/"} />
    </AuthProvider>
    )
  }
}
```

## License

MIT © [l3omtz](https://github.com/l3omtz)
