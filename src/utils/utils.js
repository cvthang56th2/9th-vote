
export const snapshotToArray = (snapshot) => {
  const data = [];
  if (snapshot) {
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
  }
  return data;
};