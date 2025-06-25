const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API route
app.post('/submit-lead', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    trusted_form_url,
    accident_state,
    caller_id
  } = req.body;

  const payload = {
    first_name,
    last_name,
    email,
    trusted_form_cert_url: trusted_form_url,
    accident_state,
    caller_id,
    lead_token: 'cbfba5193d134406a92b13edc2634959',
    traffic_source_id: '1016'
  };

  try {
    const response = await axios.post('https://skymarketinggroup.trackdrive.com/api/v1/leads', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return res.json({
      success: true,
      message: 'Lead submitted successfully!',
      response: response.data
    });

  } catch (error) {
    if (error.response && error.response.data) {
      console.error('TrackDrive API Error:', JSON.stringify(error.response.data, null, 2));
      return res.status(422).json({
        success: false,
        message: 'Validation error from TrackDrive',
        response: error.response.data
      });
    } else {
      console.error('Unexpected Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Unexpected error submitting lead',
        error: error.message
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
