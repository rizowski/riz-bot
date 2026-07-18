export const embeds = {
  error({ title, description }, fields) {
    return {
      embeds: [
        {
          title,
          description,
          color: 12124160,
          fields,
        },
      ],
    };
  },
  success({ title, description }, fields) {
    return {
      embeds: [
        {
          title,
          description,
          color: 47377,
          fields,
        },
      ],
    };
  },
};
