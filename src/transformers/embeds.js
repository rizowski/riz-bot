module.exports = {
  errors: {
    general(title, reason, fields) {
      const description = reason && `Reason: ${reason}`;

      const result = {
        embed: {
          title,
          color: 12124160,
          description,
        },
      };

      if (fields) {
        result.embed.fields = fields;
      }

      return result;
    },
  },
};
