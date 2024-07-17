import { h } from "preact";
import { useEffect } from "preact/hooks";
import { Link } from "preact-router/match";
import style from "./style.css";
import { gapi } from "gapi-script";

const Header = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const start = () => {
      gapi.client.init({
        clientId: process.env.PREACT_APP_CLIENT_ID,
        scope: "profile email openid",
      });
    };
    gapi.load("client:auth2", start);
  }, []);

  const handleLogin = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser) => {
      const id_token = googleUser.getAuthResponse().id_token;
      // 将 id_token 发送到后端进行验证
      fetch("http://loc.zt.vc/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: id_token }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("User authenticated:", data);
        });
    });
  };
  return (
    <header class={style.header}>
      <a href="/" class={style.logo}>
        <h1>Qso Logger</h1>
      </a>
      <nav>
        <Link activeClassName={style.active} href="/">
          Home
        </Link>

        <button onClick={handleLogin}>Login with Google</button>
        {/* <Link activeClassName={style.active} href="/me">
        Me
      </Link>
      <Link activeClassName={style.active} href="/l/BI1UHX">
        BI1UHX
      </Link>
      <Link activeClassName={style.active} href="/a">
        +
      </Link> */}
      </nav>
    </header>
  );
};
export default Header;
