can you use the code from #file:Background.md to design the background of our react app which will user the mouse hover effect mentioned in it. Make sure it remains in background and doesn't disturb other components.



css 
```
:background {
  --scale: 1.5
  --y: 0;
  overflow: hidden;
body {
  margin: 0;
  background-color: black;
  outline: none;
  border: none;
    #wrapper {
    width: 100vw;
    height: 100vh;
      #image {
        width: 100vw;
        height: 100vh;
        background-image: url("https://images.unsplash.com/photo-1539035104074-dee66086b5e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjI0MX0&auto=format&fit=crop&w=2550&q=80");
        background-size: cover;
        transform: translateX(var(--x)) translateY(var(--y)) scale(var(--scale));
        transition: ease-out 0.7s;
        
      }
  }
}
}
```

js
```

class App extends React.Component {
  handleMouseMove = (e) => {
    const el = document.getElementById("wrapper");
    const d = el.getBoundingClientRect();
    let x = e.clientX - (d.left + Math.floor(d.width / 2));
    let y = e.clientY - (d.top + Math.floor(d.height / 2));
    // Invert values
    x = x - x * 2;
    y = y - y * 2;
    document.documentElement.style.setProperty("--scale", 1.6);
    document.documentElement.style.setProperty("--x", x / 2 + "px");

    document.documentElement.style.setProperty("--y", y / 2 + "px");
  };

  handleMouseLeave = () => {
    document.documentElement.style.setProperty("--scale", 1);
    document.documentElement.style.setProperty("--x", 0);
    document.documentElement.style.setProperty("--y", 0);
  };
  render() {
    return (
      <div
        id="wrapper"
        onMouseMove={this.handleMouseMove}
        onClick={this.handleMouseLeave}
      >
        <img id="image" />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
```