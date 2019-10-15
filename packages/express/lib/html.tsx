import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  require('reload/lib/reload-client');
}

interface HtmlProps {
  children: React.ReactNode;
  route: string;
  props: string;
}

const Html = (props: HtmlProps) => {
  return (
    <React.Fragment>
      <div id="app">{props.children}</div>
      <script src={props.route + `?props=${props.props}`}></script>
    </React.Fragment>
  );
};

export default Html;
