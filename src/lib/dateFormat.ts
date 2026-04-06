const ISO_DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const parseDateString = (dateString: string): Date => {
  if (ISO_DATE_ONLY_REGEX.test(dateString)) {
    const [year, month, day] = dateString
      .split("-")
      .map(value => Number.parseInt(value, 10));

    return new Date(year, month - 1, day);
  }

  return new Date(dateString);
};

export const formatDate = (dateString: string): string => {
  const date = parseDateString(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
