const withMongoId = (record) => {
  const plain = record?.toJSON ? record.toJSON() : record;
  if (!plain) return plain;

  return {
    ...plain,
    _id: String(plain.id),
  };
};

module.exports = withMongoId;