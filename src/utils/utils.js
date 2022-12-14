
export const snapshotToArray = (snapshot) => {
  const data = [];
  if (snapshot) {
    snapshot.forEach((doc) => {
      data.push({
        ...doc.data(),
        id: doc.id
      });
    });
  }
  return data;
};