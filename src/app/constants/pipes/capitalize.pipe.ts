import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstPipe',
})
export class capitalizeFirstPipe implements PipeTransform {
  transform(value: string): string {
    if (value !== null && value !== undefined) {
      value = value.toString().trim();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return '';
  }
}
