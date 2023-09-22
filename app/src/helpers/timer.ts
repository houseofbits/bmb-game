export function getFormattedTime(
  seconds: number,
  withDividers: boolean = false,
): string {
  const minutes = seconds / 60;
  const fullMinutes = Math.floor(minutes);
  const leftoverSeconds = Math.floor((minutes - fullMinutes) * 60);
  const secondsString = ("00" + leftoverSeconds).slice(-2);
  const minutesString = ("00" + fullMinutes).slice(-2);

  const minStrArray = minutesString.split("");
  const secStrArray = secondsString.split("");

  if (fullMinutes >= 1) {
    if (!withDividers) {
      return [
        minStrArray[0],
        minStrArray[1],
        secStrArray[0],
        secStrArray[1],
      ].join("");
    }
  }

  const leftoverSecondFractions = seconds - leftoverSeconds;
  const milisecondsString = leftoverSecondFractions.toFixed(2).slice(-2);
  const msStrArray = milisecondsString.split("");

  if (withDividers) {
    return [
      minStrArray[0],
      minStrArray[1],
      ":",
      secStrArray[0],
      secStrArray[1],
      ".",
      msStrArray[0],
      msStrArray[1],
    ].join("");
  } else {
    return [secStrArray[0], secStrArray[1], msStrArray[0], msStrArray[1]].join(
      "",
    );
  }
}
