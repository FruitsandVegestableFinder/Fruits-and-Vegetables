// date options 
const timeZone = 'Asia/Singapore';
const options = { timeZone, month: 'long', day: '2-digit', year: 'numeric' };
const options2 = { timeZone, month: 'long', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// get date now without time
const dateNow = new Date().toLocaleDateString('en-US', options);

// format date from db without time
const formatDate = (date) => {
  const newDate = date.toDate();
  return new Date(newDate).toLocaleString('en-US', options);
}

// format date from db with time
const formatDateWT = (date) => {
  const newDate = date.toDate();
  return (new Date(newDate).toLocaleString('en-US', options2)).replace('at', ' ');
}

// format date data with day, date and timezonme
const formatDateToday = (date) => {
  let dateNow = (new Date(date).toLocaleString('en-US', options)).replace('at', ' ');
  let dayNow = days[new Date().getDay()];

  const timezoneOffset = -(new Date()).getTimezoneOffset() / 60;
  const timezoneOffsetString = `(GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset})`;

  return `${dayNow}, ${dateNow} ${timezoneOffsetString}`;
}

// date now as js
const dateNowRaw = Date.now();

// get location based on latitude and logitude (OpenStreetMap API)
// const getLocationDetails = async (latitude, longitude) => {
//     const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return null;
//     }
// };
  
const getLocationDetails = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    
    if (data.display_name) {
      return data.display_name;
    }

    return '';
  } catch (error) {
    return '';
  }
};

// convert 24 hours to 12 format
const convertTo12HourFormat = (time) => {
  const [hours, minutes] = time.split(':');
  const period = +hours >= 12 ? 'PM' : 'AM';
  const hours12 = +hours % 12 || 12;
  const hour = hours12.toString().padStart(2, '0');
  
  return `${hour}:${minutes} ${period}`;
};

// calculate how many time passed and return as string
const timeAgo = (date) => {
  const now = new Date();
  const secondsPast = Math.floor((now - date) / 1000);

  if(!secondsPast) return '--';

  let daysPast;
  if (secondsPast < 60) {
      return secondsPast == 1 ? `${daysPast} second ago` : `${secondsPast} seconds ago`;
  }
  if (secondsPast < 3600) {
      const minutesPast = Math.floor(secondsPast / 60);
      return minutesPast == 1 ? `a minute ago` : `${minutesPast} minutes ago`;
  }
  if (secondsPast < 86400) {
      const hoursPast = Math.floor(secondsPast / 3600);
      return hoursPast == 1 ? `about an hour ago` : `${hoursPast} hours ago`;
  }

  daysPast = Math.floor(secondsPast / 86400);
  return daysPast == 1 ? `a day ago` : `${daysPast} days ago`;
}

// informations leave blank if you dont want to display
const informations = {
  tel: '+63312312321',
  email: 'info@domain.com',
  fbpage: 'https://www.facebook.com/'
}

// max row of table
const rowsPerPage = 10;

// generate random id for iamge
const generateRandomId = () => {
  const now = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  const randomExtra = Math.random().toString(36).substr(2, 9);
  return `${now}-${random}-${randomExtra}`;
}
export { 
  dateNow, 
  formatDate, 
  dateNowRaw, 
  formatDateWT, 
  getLocationDetails, 
  convertTo12HourFormat, 
  formatDateToday,
  informations,
  timeAgo,
  rowsPerPage,
  generateRandomId
}