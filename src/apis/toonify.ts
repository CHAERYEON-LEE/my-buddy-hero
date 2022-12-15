import FormData from 'form-data';
import axios from 'axios';

type IModel = 'toonify' | 'toonifyplus' | 'emojify';

export const getToonifyImage = async (data: FormData, model: IModel) => {
  const options = {
    method: 'POST',
    url: `https://toonify.p.rapidapi.com/v0/${model ?? 'emojify'}`,
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_TOONIFY_API_KEY,
      'X-RapidAPI-Host': 'toonify.p.rapidapi.com',
      accept: 'application/json',
    },
    data,
  };

  try {
    const { data } = await axios.request(options);
    return data.b64_encoded_output;
  } catch (err) {
    console.error(err);
  }
};

getToonifyImage.defaultProps = {
  model: 'emojify',
};