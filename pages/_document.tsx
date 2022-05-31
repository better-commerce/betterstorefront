import { /*NextScript,*/ FeaturePolyfills } from '@engineerapart/nextscript';
//import Document, { DocumentContext, Head, Html, Main } from 'next/document'
import NextDocument, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

const features = [
   FeaturePolyfills.FETCH, // ensures ES6 fetch is available
   FeaturePolyfills.CUSTOMEVENT, // ensures custom event is available
   { // example of how to add any other type of polyfill
     test: `('entries' in Array.prototype)`,
     feature: 'Array.prototype.entries',
   },
 ];

export default class MyDocument extends NextDocument /*Document*/ {
//   static async getInitialProps(ctx: DocumentContext) {
//     const initialProps = await Document.getInitialProps(ctx);
//     return { ...initialProps };
//   }

static async getInitialProps(ctx: DocumentContext) {
   const initialProps = await NextDocument.getInitialProps(ctx)
   return { ...initialProps }
}

  render() {
    return (
      <html>
        <Head></Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}