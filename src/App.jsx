import React, { useState, useRef } from 'react';
import { Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

const App = () => {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);

  const handleSpeak = () => {
    setLoading(true);
    const utterance = new SpeechSynthesisUtterance(
      'هذا اختبار للصوت على المتصفح اذا كنت تسمع ذلك فهذا يعني ان المتصفح لديك يدعم تحويل النص الى صوت'
    );
    utterance.lang = 'ar-SA';
    utterance.onend = () => setLoading(false);
    speechSynthesis.speak(utterance);
  };

  const handleSpeechStart = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('المتصفح لا يدعم تحويل الصوت إلى نص باستخدام Web Speech API.');
      return;
    }

    setError('');
    setTranscript('');
    setLoading(true);

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1][0].transcript;
      setTranscript(prev => prev + ' ' + result);
    };

    recognition.onerror = (event) => {
      setError('حدث خطأ أثناء التحويل: ' + event.error);
      setLoading(false);
    };

    recognition.onend = () => setLoading(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSpeechEnd = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h2 className="mb-4">اختبار دعم المتصفح لتحويل النص إلى صوت والعكس</h2>

          <Button variant="primary" className="m-2" onClick={handleSpeak} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'تشغيل تحويل النص إلى صوت'}
          </Button>

          <Button
            variant="success"
            className="m-2"
            onMouseDown={handleSpeechStart}
            onMouseUp={handleSpeechEnd}
            onTouchStart={handleSpeechStart}
            onTouchEnd={handleSpeechEnd}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'اضغط مطولاً للتسجيل'}
          </Button>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {transcript && <Alert variant="info" className="mt-3">النص المحول: {transcript}</Alert>}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
