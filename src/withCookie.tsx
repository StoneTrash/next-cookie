import { NextComponentType, NextPageContext } from 'next'
import * as React from 'react'

import { Cookie } from './Cookie'

export interface WithCookieProps {
  cookie?: Cookie,
}

export interface WithCookieContext extends NextPageContext {
  cookie?: Cookie,
}

export function withCookie<Props extends WithCookieProps, InitialProps extends { [key: string]: any }>(
  ComposedComponent: NextComponentType<WithCookieContext, InitialProps, Props>
): NextComponentType<WithCookieContext, InitialProps, Props> {

  const name: string = ComposedComponent.displayName || ComposedComponent.name

  class WithCookieWrapper extends React.Component<Props> {
    static displayName = `withCookie(${name})`

    static getInitialProps?: (ctx: WithCookieContext) => Promise<InitialProps>

    public render(): JSX.Element {
      const cookie = new Cookie()

      return (
        <ComposedComponent
          cookie={cookie}
          {...this.props as Props} />
      )
    }
  }

  if (ComposedComponent.getInitialProps) {
    WithCookieWrapper.getInitialProps = async (ctx: WithCookieContext): Promise<InitialProps> => {
      ctx.cookie = new Cookie(ctx)

      const initialProps = await ComposedComponent.getInitialProps(ctx)

      if (ctx.cookie) {
        delete ctx.cookie
      }

      return initialProps as InitialProps
    }
  }

  return WithCookieWrapper
}
