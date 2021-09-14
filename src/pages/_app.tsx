import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../utils/theme";
import { CssBaseline } from "@material-ui/core";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyle = document.querySelector("#jss-server-side");
    jssStyle?.parentElement?.removeChild(jssStyle);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
export default MyApp;
