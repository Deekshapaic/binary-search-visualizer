import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const Header = (props) => {
  return (
    <Navbar as="header" bg="transparent" expand="lg" className="py-3">
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <div className="logo-icon me-3">
            🔍
          </div>
          <h3 className="mb-0">
            Binary Search <span className="text-primary">Visualizer</span>
          </h3>
        </Navbar.Brand>
        <Navbar.Text className="text-white-50">
          Interactive Algorithm Visualization
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default Header;
