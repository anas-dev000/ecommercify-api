const setImageUrl = (document, fieldName, folderName) => {
  if (document[fieldName]) {
    if (Array.isArray(document[fieldName])) {
      document[fieldName] = document[fieldName].map(
        (image) => `${process.env.BASE_URL}/${folderName}/${image}`
      );
    } else {
      document[fieldName] = `${process.env.BASE_URL}/${folderName}/${document[fieldName]}`;
    }
  }
};

module.exports = setImageUrl;
