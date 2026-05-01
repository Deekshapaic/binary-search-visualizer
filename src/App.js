import { createArrayFromInput, getCellItemClass } from './utils/helper';
import ProgressBar from 'react-bootstrap/ProgressBar';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState, useEffect, useRef } from 'react';
import { binarySearch, recursiveBinarySearch, linearSearch } from './utils/binarySearch';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Footer from './components/Footer';
import Header from './components/Header';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';

function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [searchItem, setSearchItem] = useState(7);
  const [inputData, setInputData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultIter, setResultIter] = useState([-1, []]);
  const [resultRec, setResultRec] = useState([-1, []]);
  const [input, setInput] = useState('');
  const [predictedIterations, setPredictedIterations] = useState(0);
  const [isSorted, setIsSorted] = useState(true);
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [linearResult, setLinearResult] = useState([-1, []]);
  const [autoPlay, setAutoPlay] = useState(false);

  const alertVariant = useRef('primary');
  const autoPlayRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const numbersList = createArrayFromInput(input);
    const sorted = numbersList.every((value, index) => index === 0 || numbersList[index] >= numbersList[index - 1]);
    setInputData(numbersList);
    setPredictedIterations(numbersList.length ? Math.ceil(Math.log2(numbersList.length)) : 0);
    setCurrentStep(0);
    setIsSorted(sorted);
  };

  const handleSearchItemChange = (event) => {
    setSearchItem(event.target.value);
  };

  useEffect(() => {
    if (!inputData.length) {
      setResultIter([-1, []]);
      setResultRec([-1, []]);
      setAlertMessage('');
      setLoading(false);
      setCurrentStep(0);
      return;
    }

    setLoading(true);
    const parsedItem = parseInt(searchItem, 10);
    const iterResult = binarySearch(inputData, parsedItem, isSorted);
    const recResult = recursiveBinarySearch(inputData, parsedItem, 0, inputData.length - 1, [], 1);
    const linResult = linearSearch(inputData, parsedItem);

    if (!isSorted) {
      setAlertMessage('Warning: Array is not sorted. Binary Search may produce an invalid result.');
      alertVariant.current = 'warning';
    } else if (iterResult[0] > -1) {
      setAlertMessage(`Element found on index ${iterResult[0]}`);
      alertVariant.current = 'primary';
    } else {
      setAlertMessage('Element cannot be found in the list');
      alertVariant.current = 'danger';
    }

    setLoading(false);
    setResultIter(iterResult);
    setResultRec(recResult);
    setLinearResult(linResult);
  }, [inputData, searchItem, isSorted]);

  useEffect(() => {
    const maxStep = Math.max(resultIter[1]?.length || 0, resultRec[1]?.length || 0) - 1;
    if (currentStep > maxStep) {
      setCurrentStep(Math.max(0, maxStep));
    }
  }, [resultIter, resultRec, currentStep]);

  useEffect(() => {
    if (!autoPlay || !isLearningMode) return;

    const maxStep = Math.max(resultIter[1]?.length || 0, resultRec[1]?.length || 0) - 1;
    if (currentStep >= maxStep) {
      setAutoPlay(false);
      return;
    }

    autoPlayRef.current = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, maxStep));
    }, 800);

    return () => clearTimeout(autoPlayRef.current);
  }, [autoPlay, currentStep, isLearningMode, resultIter, resultRec]);

  const generateBestCase = () => {
    const size = 16;
    const arr = Array.from({ length: size }, (_, i) => i * 2);
    const mid = Math.floor(size / 2);
    setIsSorted(true);
    setInputData(arr);
    setSearchItem(arr[mid]);
    setInput(arr.join(','));
    setPredictedIterations(Math.ceil(Math.log2(size)));
    setCurrentStep(0);
  };

  const generateWorstCase = () => {
    const size = 16;
    const arr = Array.from({ length: size }, (_, i) => i * 2);
    setIsSorted(true);
    setInputData(arr);
    setSearchItem(arr[size - 1]);
    setInput(arr.join(','));
    setPredictedIterations(Math.ceil(Math.log2(size)));
    setCurrentStep(0);
  };

  const generateAverageCase = () => {
    const size = 16;
    const arr = Array.from({ length: size }, (_, i) => i * 2);
    const randomIndex = Math.floor(Math.random() * size);
    setIsSorted(true);
    setInputData(arr);
    setSearchItem(arr[randomIndex]);
    setInput(arr.join(','));
    setPredictedIterations(Math.ceil(Math.log2(size)));
    setCurrentStep(0);
  };

  const generateSmallDataset = () => {
    const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    setIsSorted(true);
    setInputData(arr);
    setSearchItem(7);
    setInput(arr.join(','));
    setPredictedIterations(Math.ceil(Math.log2(arr.length)));
    setCurrentStep(0);
  };

  const generateMediumDataset = () => {
    const arr = Array.from({ length: 100 }, (_, i) => i * 2);
    setIsSorted(true);
    setInputData(arr);
    setSearchItem(50);
    setInput(arr.join(','));
    setPredictedIterations(Math.ceil(Math.log2(arr.length)));
    setCurrentStep(0);
  };

  const generateLargeDataset = () => {
    const arr = Array.from({ length: 10000 }, (_, i) => i + 1);
    setIsSorted(true);
    setInputData(arr);
    setSearchItem(5000);
    setInput(arr.join(','));
    setPredictedIterations(Math.ceil(Math.log2(arr.length)));
    setCurrentStep(0);
  };

  const nextStep = () => {
    const maxStep = Math.max(resultIter[1]?.length || 0, resultRec[1]?.length || 0) - 1;
    setCurrentStep((prev) => Math.min(prev + 1, maxStep));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const sortCurrentArray = () => {
    const currentData = createArrayFromInput(input);
    const sorted = [...currentData].sort((a, b) => a - b);
    setIsSorted(true);
    setInputData(sorted);
    setInput(sorted.join(','));
    setPredictedIterations(sorted.length ? Math.ceil(Math.log2(sorted.length)) : 0);
    setCurrentStep(0);
  };

  const shuffleCurrentArray = () => {
    const currentData = createArrayFromInput(input);
    const shuffled = [...currentData].sort(() => Math.random() - 0.5);
    setIsSorted(false);
    setInputData(shuffled);
    setInput(shuffled.join(','));
    setPredictedIterations(0);
    setCurrentStep(0);
  };

  const toggleAutoPlay = () => {
    setAutoPlay((prev) => !prev);
  };

  const sortAndSearch = () => {
    const currentData = createArrayFromInput(input);
    if (currentData.length === 0) return;
    const sorted = [...currentData].sort((a, b) => a - b);
    const midIndex = Math.floor(sorted.length / 2);
    const searchValue = sorted[midIndex];
    setIsSorted(true);
    setInputData(sorted);
    setSearchItem(searchValue);
    setInput(sorted.join(','));
    setPredictedIterations(sorted.length ? Math.ceil(Math.log2(sorted.length)) : 0);
    setCurrentStep(0);
  };

  const actualIter = resultIter[1]?.length || 0;
  const actualRec = resultRec[1]?.length || 0;
  const actualLinear = linearResult[1]?.length || 0;
  const chartData = resultIter[1]?.map((r) => ({
    iteration: r.iteration,
    searchSpace: r.upperBound - r.lowerBound + 1,
  })) || [];
  const complexityPosition = inputData.length ? Math.min(100, (actualIter / inputData.length) * 100) : 0;
  const currentStepDetail = resultIter[1]?.[currentStep] || resultRec[1]?.[currentStep] || null;
  const stepExplanation = currentStepDetail
    ? `Step ${currentStepDetail.iteration}: checking index ${currentStepDetail.mid} (${inputData[currentStepDetail.mid]}) and narrowing search to ${
        searchItem > inputData[currentStepDetail.mid] ? 'the right' : 'the left'
      } side.`
    : '';
  const currentMidValue = currentStepDetail ? inputData[currentStepDetail.mid] : null;
  const remainingSpace = currentStepDetail ? currentStepDetail.upperBound - currentStepDetail.lowerBound + 1 : 0;
  const searchDecision = currentStepDetail
    ? Number(searchItem) === currentMidValue
      ? 'Target matched the midpoint.'
      : Number(searchItem) > currentMidValue
        ? 'Target is larger, so the left half is removed.'
        : 'Target is smaller, so the right half is removed.'
    : 'Run a search to see the active low, mid, and high pointers.';
  const learnPages = [
    { title: 'Binary Search Guide', href: `${process.env.PUBLIC_URL}/binary-search.html` },
    { title: 'Linear vs Binary', href: `${process.env.PUBLIC_URL}/linear-vs-binary.html` },
    { title: 'Complexity Notes', href: `${process.env.PUBLIC_URL}/complexity.html` },
  ];
  const searchJourney = resultIter[1]?.map((step) => ({
    ...step,
    value: inputData[step.mid],
    space: step.upperBound - step.lowerBound + 1,
  })) || [];
  const eliminatedCount = currentStepDetail ? inputData.length - remainingSpace : 0;
  const sortedStatus = inputData.length ? (isSorted ? 'Sorted' : 'Unsorted') : 'Waiting';
  const targetIndex = resultIter[0] > -1 ? resultIter[0] : resultRec[0];
  const bestMethod = actualIter && actualLinear
    ? actualIter <= actualLinear ? 'Binary search' : 'Linear search'
    : 'Run a search';
  const maxValue = inputData.length ? Math.max(...inputData) : '-';
  const minValue = inputData.length ? Math.min(...inputData) : '-';
  const efficiencyPercent = actualLinear
    ? Math.max(0, Math.round(((actualLinear - actualIter) / actualLinear) * 100))
    : 0;
  const resultLabel = !inputData.length
    ? 'Ready'
    : targetIndex > -1
      ? `Found at index ${targetIndex}`
      : 'Target not found';
  const searchWindowPercent = inputData.length ? Math.round((remainingSpace / inputData.length) * 100) : 0;
  const linearWidth = actualLinear ? 100 : 0;
  const binaryWidth = actualLinear && actualIter ? Math.max(8, Math.round((actualIter / actualLinear) * 100)) : 0;
  const getDisplayItems = (step = currentStepDetail) => {
    const displayLimit = 72;
    if (inputData.length <= displayLimit) {
      return inputData.map((value, index) => ({ value, index }));
    }

    const focusIndex = step?.mid || 0;
    const halfWindow = Math.floor(displayLimit / 2);
    const start = Math.max(0, Math.min(inputData.length - displayLimit, focusIndex - halfWindow));
    return inputData.slice(start, start + displayLimit).map((value, offset) => ({
      value,
      index: start + offset,
    }));
  };
  const overviewItems = getDisplayItems();

  const generatePdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    doc.setFontSize(18);
    doc.text('Binary Search Report', 40, 50);
    doc.setFontSize(12);
    doc.text(`Array size: ${inputData.length}`, 40, 90);
    doc.text(`Predicted iterations: ${predictedIterations}`, 40, 110);
    doc.text(`Iterative iterations: ${actualIter}`, 40, 130);
    doc.text(`Recursive iterations: ${actualRec}`, 40, 150);
    doc.text(`Linear search iterations: ${actualLinear}`, 40, 170);
    doc.text(`Sorted input: ${isSorted ? 'Yes' : 'No'}`, 40, 190);
    doc.text('Observations:', 40, 200);
    doc.text(`- Search space shrinks step-by-step toward the target.`, 60, 220);
    doc.text(`- Binary Search uses ${predictedIterations} theoretical steps for n=${inputData.length}.`, 60, 240);
    const values = chartData.slice(0, 20).map((item) => `${item.iteration}:${item.searchSpace}`);
    doc.text('Search Space Data (first 20):', 40, 270);
    values.forEach((value, index) => {
      doc.text(value, 60, 290 + index * 14);
    });
    const reportUrl = doc.output('bloburl');
    const reportWindow = window.open(reportUrl, '_blank', 'noopener,noreferrer');
    if (!reportWindow) {
      doc.save('binary-search-report.pdf');
    }
  };

  return (
    <Container fluid>
      <Row xs={1} className="d-flex flex-column min-vh-100">
        <Col className="p-0">
          <Header />
        </Col>
        <Col>
          <section className="hero-panel mb-3">
            <div>
              <div className="feature-label">Algorithm command center</div>
              <h1>Binary Search Visualizer</h1>
              <p>
                Watch the search space collapse in real time, compare algorithms, and open quick reference pages when you want the theory.
              </p>
            </div>
            <div className="hero-stats">
              <div>
                <span>Status</span>
                <strong>{resultLabel}</strong>
              </div>
              <div>
                <span>Array size</span>
                <strong>{inputData.length || '-'}</strong>
              </div>
              <div>
                <span>Saved steps</span>
                <strong>{efficiencyPercent}%</strong>
              </div>
              <div>
                <span>Search window</span>
                <strong>{searchWindowPercent || 0}%</strong>
              </div>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="mb-3 p-1">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Enter list of numbers separated by comma, example 1, 2, 3, 4, 5 ...."
                aria-label="Enter the comma separated list of numbers"
                onChange={handleInputChange}
                pattern="^\d+(,\d+)*$"
                value={input}
                required
              />
              <FormControl
                className="bg-light border-primary"
                onChange={handleSearchItemChange}
                style={{ maxWidth: '25ch' }}
                placeholder="Search Number"
                value={searchItem}
                type="number"
              />
              <Button disabled={loading} variant="outline-primary" type="submit">
                Find
              </Button>
            </InputGroup>
            {predictedIterations > 0 && (
              <Alert variant="info" className="mb-3">
                <strong>Prediction:</strong> For array size {inputData.length}, Binary Search will take maximum {predictedIterations} iterations.
              </Alert>
            )}
            <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
              <Button variant="outline-secondary" onClick={generateSmallDataset}>Small (10)</Button>
              <Button variant="outline-secondary" onClick={generateMediumDataset}>Medium (100)</Button>
              <Button variant="outline-secondary" onClick={generateLargeDataset}>Large (10,000)</Button>
            </div>
            <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
              <Button variant="success" onClick={generateBestCase}>Best Case</Button>
              <Button variant="warning" onClick={generateWorstCase}>Worst Case</Button>
              <Button variant="info" onClick={generateAverageCase}>Average Case</Button>
            </div>
            <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
              <Button variant="danger" onClick={() => { setIsSorted(false); setInputData([5, 3, 8, 1, 9, 2]); setSearchItem(8); setInput('5,3,8,1,9,2'); setPredictedIterations(0); setCurrentStep(0); }}>Try Unsorted Array</Button>
              <Button variant="success" onClick={sortAndSearch}>Sort & Search</Button>
              <Button variant="outline-secondary" onClick={sortCurrentArray}>Sort Array</Button>
              <Button variant="outline-secondary" onClick={shuffleCurrentArray}>Shuffle Array</Button>
            </div>
            {loading && <ProgressBar animated now={100} />}
          </form>

          {alertMessage && (
            <Alert variant={alertVariant.current} className="mb-5">
              {alertMessage}
            </Alert>
          )}

          <Row>
            <Col xl={8}>
              <Card className="mb-3">
                <Card.Header>Binary Search Overview</Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table className="border-primary" variant="secondary" size="sm" bordered>
                      <tbody>
                        <tr>
                          {overviewItems.map(({ value, index }) => (
                            <td
                              key={index}
                              data-index={index}
                              className={`text-center fw-bold array-item ${getCellItemClass(resultIter[1]?.[currentStep], index)}`}
                            >
                              {value}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  {inputData.length > overviewItems.length && (
                    <div className="array-window-note">
                      Showing {overviewItems.length} focused values around the active midpoint from {inputData.length} total values.
                    </div>
                  )}

                  <div className="mb-3">
                    <Button variant="secondary" onClick={() => { setIsLearningMode(!isLearningMode); setAutoPlay(false); }} className="me-2">
                      {isLearningMode ? 'Disable' : 'Enable'} Learning Mode
                    </Button>
                    {isLearningMode && (
                      <>
                        <Button variant="primary" onClick={prevStep} disabled={currentStep === 0} className="me-2">Previous Step</Button>
                        <Button variant="primary" onClick={nextStep} disabled={currentStep >= Math.max(resultIter[1]?.length, resultRec[1]?.length) - 1}>Next Step</Button>
                        <Button variant={autoPlay ? 'danger' : 'success'} onClick={toggleAutoPlay} className="me-2">
                          {autoPlay ? 'Pause' : 'Auto Play'}
                        </Button>
                        <span className="ms-3">Step: {currentStep + 1} / {Math.max(resultIter[1]?.length, resultRec[1]?.length) || 0}</span>
                      </>
                    )}
                    {isLearningMode && stepExplanation && (
                      <div className="mt-2 text-info">{stepExplanation}</div>
                    )}
                  </div>

                  <div className="feature-panel">
                    <div className="feature-panel-main">
                      <div className="feature-label">Current step</div>
                      <h4>{currentStepDetail ? `Iteration ${currentStepDetail.iteration}` : 'Ready to visualize'}</h4>
                      <p>{searchDecision}</p>
                      <div className="pointer-grid">
                        <div>
                          <span>Low</span>
                          <strong>{currentStepDetail ? currentStepDetail.lowerBound : '-'}</strong>
                        </div>
                        <div>
                          <span>Mid</span>
                          <strong>{currentStepDetail ? `${currentStepDetail.mid} (${currentMidValue})` : '-'}</strong>
                        </div>
                        <div>
                          <span>High</span>
                          <strong>{currentStepDetail ? currentStepDetail.upperBound : '-'}</strong>
                        </div>
                        <div>
                          <span>Remaining</span>
                          <strong>{remainingSpace || '-'}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="feature-panel-links">
                      <div className="feature-label">Open in new page</div>
                      {learnPages.map((page) => (
                        <a key={page.href} href={page.href} target="_blank" rel="noreferrer">
                          {page.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Row>
                <Col lg={7}>
                  <Card className="mb-3">
                    <Card.Header>Search Journey</Card.Header>
                    <Card.Body>
                      {searchJourney.length ? (
                        <div className="journey-list">
                          {searchJourney.map((step, index) => (
                            <div
                              key={step.iteration}
                              className={`journey-step ${index === currentStep ? 'active' : ''}`}
                            >
                              <div className="journey-marker">{step.iteration}</div>
                              <div>
                                <strong>Checked index {step.mid}</strong>
                                <p>
                                  Value {step.value}, search space {step.space}, bounds {step.lowerBound} to {step.upperBound}.
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">Run a search to build a step-by-step journey.</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={5}>
                  <Card className="mb-3">
                    <Card.Header>Array Insights</Card.Header>
                    <Card.Body>
                      <div className="insight-grid">
                        <div>
                          <span>Status</span>
                          <strong>{sortedStatus}</strong>
                        </div>
                        <div>
                          <span>Target index</span>
                          <strong>{targetIndex > -1 ? targetIndex : 'Not found'}</strong>
                        </div>
                        <div>
                          <span>Min / Max</span>
                          <strong>{minValue} / {maxValue}</strong>
                        </div>
                        <div>
                          <span>Eliminated</span>
                          <strong>{eliminatedCount}</strong>
                        </div>
                        <div>
                          <span>Best method</span>
                          <strong>{bestMethod}</strong>
                        </div>
                        <div>
                          <span>Step saving</span>
                          <strong>{efficiencyPercent}%</strong>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col xl={4}>
              <Card className="mb-3">
                <Card.Header>Search Space Shrink Graph</Card.Header>
                <Card.Body>
                  {chartData.length ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="iteration" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="searchSpace" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted">Run a search to see shrinking search space.</p>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header>Real-Time vs Theoretical</Card.Header>
                <Card.Body>
                  <div className="mb-2"><strong>Theoretical:</strong> O(log₂ n) = {predictedIterations}</div>
                  <div className="mb-2"><strong>Iterative:</strong> {actualIter}</div>
                  <div className="mb-2"><strong>Recursive:</strong> {actualRec}</div>
                  <div className="mb-2"><strong>Linear:</strong> {actualLinear}</div>
                  <div className="mb-2"><strong>Data Size:</strong> {inputData.length}</div>
                  <div className="complexity-meter mt-3">
                    <div className="meter-track">
                      <div className="meter-segment red">O(n)</div>
                      <div className="meter-segment yellow">O(n log n)</div>
                      <div className="meter-segment green">O(log n)</div>
                      <div className="meter-pointer" style={{ left: `${complexityPosition}%` }} />
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header>Linear Search Comparison</Card.Header>
                <Card.Body>
                  <div className="mb-2"><strong>Linear search steps:</strong> {actualLinear}</div>
                  <div className="mb-2 text-muted">Binary search eliminates half the remaining array each step, while linear search checks elements sequentially.</div>
                  <div className="mb-2"><strong>Performance gap:</strong> {actualLinear - actualIter} extra steps compared to iterative binary search.</div>
                  <div className="race-bars mt-3">
                    <div>
                      <span>Binary</span>
                      <div className="race-track">
                        <div className="race-fill binary" style={{ width: `${binaryWidth}%` }} />
                      </div>
                    </div>
                    <div>
                      <span>Linear</span>
                      <div className="race-track">
                        <div className="race-fill linear" style={{ width: `${linearWidth}%` }} />
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header>Report</Card.Header>
                <Card.Body>
                  <Button variant="outline-dark" onClick={generatePdf}>Generate PDF Report</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card className="mb-3">
                <Card.Header>Iterative Binary Search</Card.Header>
                <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {actualIter ? (
                    (isLearningMode ? [resultIter[1][currentStep]] : [resultIter[1][resultIter[1].length - 1]]).map((r) => (
                      <div key={r.iteration} className="border border-primary rounded mb-3 p-2">
                        <div className="mb-2 d-flex flex-wrap gap-2 align-items-center">
                          <strong>Iteration {r.iteration}</strong>
                          <span className="badge bg-danger">L: {r.lowerBound}</span>
                          <span className="badge bg-success">M: {r.mid}</span>
                          <span className="badge bg-info">U: {r.upperBound}</span>
                        </div>
                        <Table bordered size="sm">
                          <tbody>
                            <tr>
                              {getDisplayItems(r).map(({ value, index }) => (
                                <td
                                  key={index}
                                  data-index={index}
                                  className={`text-center fw-bold array-item ${getCellItemClass(r, index)}`}
                                >
                                  {value}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Run a search to see iterative steps.</p>
                  )}
                  {!isLearningMode && resultIter[1]?.length > 0 && (
                    <div className="text-muted small mt-2">
                      Showing final iteration. Enable Learning Mode to step through all {resultIter[1]?.length} iterations.
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="mb-3">
                <Card.Header>Recursive Binary Search</Card.Header>
                <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {actualRec ? (
                    (isLearningMode ? [resultRec[1][currentStep]] : [resultRec[1][resultRec[1].length - 1]]).map((r) => (
                      <div key={r.iteration} className="border border-primary rounded mb-3 p-2">
                        <div className="mb-2 d-flex flex-wrap gap-2 align-items-center">
                          <strong>Iteration {r.iteration}</strong>
                          <span className="badge bg-danger">L: {r.lowerBound}</span>
                          <span className="badge bg-success">M: {r.mid}</span>
                          <span className="badge bg-info">U: {r.upperBound}</span>
                        </div>
                        <Table bordered size="sm">
                          <tbody>
                            <tr>
                              {getDisplayItems(r).map(({ value, index }) => (
                                <td
                                  key={index}
                                  data-index={index}
                                  className={`text-center fw-bold array-item ${getCellItemClass(r, index)}`}
                                >
                                  {value}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Run a search to see recursive steps.</p>
                  )}
                  {!isLearningMode && resultRec[1]?.length > 0 && (
                    <div className="text-muted small mt-2">
                      Showing final iteration. Enable Learning Mode to step through all {resultRec[1]?.length} iterations.
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col className="p-0 mt-auto">
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
