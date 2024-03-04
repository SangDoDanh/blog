export default class VersionContent {
  constructor(element) {
    this.element = element;
    this.versionContents = [new Version(element.value, element.selectionStart)];
    this.dowTime = 0;
    this.loopTime = null;
    this.currentPositionVersion = 0;
  }

  start() {
    this.element.addEventListener("input", () => {
      this.clearCountingTime();
      this.countingTime();
    });
  }

  redoVersion() {
    const versionLength = this.versionContents.length;
    this.currentPositionVersion =
      this.currentPositionVersion + 1 < versionLength
        ? this.currentPositionVersion + 1
        : versionLength - 1;
    this.gotoVersion();
  }

  undoVersion() {
    this.currentPositionVersion =
      this.currentPositionVersion - 1 >= 0
        ? this.currentPositionVersion - 1
        : 0;
    this.gotoVersion();
  }

  canUndo() {
    return this.currentPositionVersion > 0;
  }

  canRedo() {
    return this.currentPositionVersion < this.versionContents.length - 1;
  }

  gotoVersion() {
    const version = this.versionContents[this.currentPositionVersion];
    this.element.value = version.value;
    this.element.focus();
    this.element.setSelectionRange(version.position, version.position);
  }

  countingTime() {
    const me = this;
    let timing = 0;
    this.loopTime = setInterval(() => {
      timing += 100;
      console.log("counting time ...", timing);
      if (timing == 500) {
        const version = this.createVersion();
        this.addVersion(version);
        me.clearCountingTime();
      }
    }, 100);
  }
  createVersion() {
    const version = new Version(
      this.element.value,
      this.element.selectionStart
    );
    return version;
  }
  addVersion(version) {
    this.versionContents.push(version);
    const versionContentsLength = this.versionContents.length;
    if (versionContentsLength <= 1) {
      this.currentPositionVersion = 1;
    } else {
      this.currentPositionVersion = this.versionContents.length - 1;
    }
  }

  clearCountingTime() {
    if (this.loopTime) clearInterval(this.loopTime);
  }
}
class Version {
  constructor(value, position) {
    this.value = value;
    this.position = position;
  }
}
