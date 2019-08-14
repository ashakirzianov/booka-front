import * as React from 'react';
import { Callback } from '../utils';

export type FileLike = {
    lastModified: number,
    size: number,
    name: string,
    type: string,
    slice(): any,
};
export type FileUploadDialogRef = {
    show: Callback,
};
export type FileUploadDialogProps = {
    refCallback: Callback<FileUploadDialogRef>,
    onFilesSelected: Callback<FileLike[]>,
};
export function FileUploadDialog({ refCallback, onFilesSelected }: FileUploadDialogProps) {
    return <input
        style={{ display: 'none' }}
        ref={r => refCallback({ show: () => r && r.click() })}
        type='file'
        onChange={e => {
            if (e.target.files) {
                const files: FileLike[] = [];
                // tslint:disable-next-line: prefer-for-of
                for (let idx = 0; idx < e.target.files.length; idx++) {
                    const file = e.target.files[idx];
                    files.push(file);
                }
                onFilesSelected(files);
            }
        }}
    />;
}
