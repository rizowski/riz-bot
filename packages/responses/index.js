exports.embeds = {
  error({ title, description }, fields) {
    return {
      embed: {
        title,
        description,
        color: 12124160,
        fields,
      },
    };
  },
  success({ title, description }, fields) {
    return {
      embed: {
        title,
        description,
        color: 47377,
        fields,
      },
    };
  },
};
