import { useState, useEffect } from "react";
import axios from 'axios'
import { Buffer } from 'buffer';

function App() {
  const [captcha, setCaptcha] = useState([]);
  const [answers, setAnswers] = useState([]); // answers to submit
  const [options, setOptions] = useState([]); // options shown
  const [selectedOptions, setSelectedOptions] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  const requestCaptcha = async () => {
    axios
      .get('http://localhost:9999/captcha')
      .then((response) => {
        setCaptcha(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    requestCaptcha();
  }, []);


  useEffect(() => {
    setOptions(captcha.answers);
    uncheckOptions();
  }, [captcha]);

  useEffect(() => {
    postAnswers();
  }, [answers]);


  const checkAnswers = async () => {
    let userAnswers = [];
    for (let i = 0; i < selectedOptions.length; i++) {
      if (selectedOptions[i] === 1) userAnswers.push(options[i]);
    }
    if (userAnswers.length !== 2) {
      refreshCaptcha();
    }
    else {
      setAnswers([...userAnswers]);
    }
  }

  const postAnswers = async () => {
    axios
      .post(`http://localhost:9999/captcha/${captcha._id}/validate`, { "answers": answers })
      .then((response) => {
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkAnswers();
  };

  const uncheckOptions = () => {
    setSelectedOptions([0, 0, 0, 0, 0, 0, 0, 0]);
  }

  const refreshCaptcha = (e) => {
    e.preventDefault();
    uncheckOptions();
    requestCaptcha();
  }

  const toggleChecked = (index) => {
    const selected = selectedOptions;
    if (!selectedOptions[index]) { // not selected -> select
      selected[index] = 1;
      setSelectedOptions([...selected]);
    } else { // selected -> unselect
      selected[index] = 0;
      setSelectedOptions([...selected]);
    }
  };

  const toggleCheckedStyles = (index) => {
    if (selectedOptions[index] === 1) {
      return "option checked";
    } else {
      return "option unchecked";
    }
  };

  const getImageURL = () => {
    const bufferData = captcha.image.data; // Assuming response.data.image.data contains the Buffer data
    const base64Data = Buffer.from(bufferData).toString('base64');
    const imageSrc = `data:image/jpeg;base64,${base64Data}`;
    return imageSrc;
  }


  return (
    <main>
      <header>
        <h1>UnCAPTCHAble</h1>
      </header>
      <form className='captcha-form'>
        <h1>What can you see in this picture?</h1>
        <img alt='captcha' src={captcha && captcha.image ? getImageURL() : 'https://placehold.co/400x400'} />
        <section className='options-container'>
          {captcha && captcha.answers ?
            captcha.answers.map((element, index) => (
              <div
                key={index}
                className={toggleCheckedStyles(index)}
                onClick={() => { toggleChecked(index); }}
              >{element}</div>))
            : 'loading'}
        </section>
        <section className='btns-wrap'>
          <button className='refresh-btn' onClick={refreshCaptcha}>Refresh</button>
          <button type='submit' onClick={handleSubmit}>Submit</button>
        </section>
      </form>
    </main>
  );
}

export default App;
