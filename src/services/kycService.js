const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getKycList = async () => {
  await delay(300);

  return [
    {
      id: 1,
      business: "ABC Traders",
      rm: "Rahul",
      stage: "RM Review",
      status: "PENDING",
      docs: { aadhaar: null, pan: null, gst: null },
    },
    {
      id: 2,
      business: "XYZ Pvt Ltd",
      rm: "Priya",
      stage: "Backend",
      status: "PENDING",
      docs: { aadhaar: null, pan: null, gst: null },
    },
  ];
};

export const uploadKycDocument = async (id, type, file) => {
  await delay(300);
  return {
    fileUrl: URL.createObjectURL(file),
  };
};