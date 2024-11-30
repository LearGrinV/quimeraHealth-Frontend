import { afterNextRender, Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../Shared/flowbite.service';

@Component({
  selector: 'app-clases',
  standalone: true,
  imports: [],
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.css'
})
export class ClasesComponent {

  constructor(private flowbiteService:FlowbiteService,
              ) {
                afterNextRender(() => {
                  this.flowbiteService.loadFlowbite((flowbite) => {
                    console.log('Flowbite loaded', flowbite);
                  });
                });
              }
}
