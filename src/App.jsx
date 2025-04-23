import React, { useState, useRef } from 'react';
import { Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

const App = () => {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [loadingSpeech, setLoadingSpeech] = useState(false);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  const handleSpeak = () => {
    setLoadingSpeech(true);
    const utterance = new SpeechSynthesisUtterance(
      'هذا اختبار للصوت على المتصفح، إذا كنت تسمع ذلك فهذا يعني أن المتصفح لديك يدعم تحويل النص إلى صوت.'
    );
    utterance.lang = 'ar-SA';
    utterance.onend = () => setLoadingSpeech(false);
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
    setRecording(true);

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
      setRecording(false);
    };

    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSpeechEnd = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h2 className="mb-4">اختبار دعم المتصفح لتحويل النص إلى صوت والعكس</h2>

          <Button
            variant="primary"
            className="m-2 d-flex align-items-center justify-content-center gap-2"
            onClick={handleSpeak}
          >
            {loadingSpeech && <Spinner animation="border" size="sm" />}
            <span>تشغيل تحويل النص إلى صوت</span>
          </Button>

          <Button
            variant={recording ? 'danger' : 'success'}
            className="m-2 d-flex align-items-center justify-content-center gap-2"
            onMouseDown={handleSpeechStart}
            onMouseUp={handleSpeechEnd}
            onTouchStart={handleSpeechStart}
            onTouchEnd={handleSpeechEnd}
          >
            {recording && <Spinner animation="grow" size="sm" />}
            <span>{recording ? 'جارٍ التسجيل...' : 'اضغط مطولاً للتسجيل'}</span>
          </Button>

          {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
          {transcript && (
            <Alert variant="info" className="mt-4 text-end" dir="rtl">
              <strong>النص المحول:</strong> {transcript}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
