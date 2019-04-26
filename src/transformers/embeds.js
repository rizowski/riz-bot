module.exports = {
  errors: {
    general(title, reason, fields) {
      const description = reason && `Reason: ${reason}`;

      return {
        embed: {
          title,
          color: 12124160,
          description,
          fields,
        },
      };
    },
  },
};
