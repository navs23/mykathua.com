/** @jsx React.DOM */
/* global React */



 class App extends React.Component {
     
   render() {
      return (
         <div>
            <h1>hello</h1>
          
         </div>
      );
   }
}
function Header()
{
    return(<h3>header</h3>);
}
     
      
React.render(<App />, document.getElementById('root') );
