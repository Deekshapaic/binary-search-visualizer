const Footer = (props) => {
  return (
    <footer className="footer mt-auto py-4">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="mb-3">
              <span className="text-muted fs-6">
                © {new Date().getFullYear()} Binary Search Visualizer
              </span>
            </div>
            <div className="text-muted">
              <span>Created by Deeksha</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
