I do want the API of the hard drive to be really nice to work with:

```tsx
const drive = useDiskDrive({ tracks, sectors });
drive.seek(2 /* track */);
// this should probably move the head as well?
drive.enqueueRead(0 /* sector number */);
```
