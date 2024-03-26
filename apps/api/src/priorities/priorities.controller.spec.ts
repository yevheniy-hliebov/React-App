import { Test } from "@nestjs/testing";
import { PrioritiesController } from "./priorities.controller";
import { PrioritiesService } from "./priorities.service";
import { PrismaService } from "../prisma.service";

describe('PriorityController', () => {
  let prioritiesController: PrioritiesController;
  let prioritiesService: PrioritiesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PrioritiesController],
      providers: [PrismaService, PrioritiesService],
    }).compile();

    prioritiesService = moduleRef.get<PrioritiesService>(PrioritiesService);
    prioritiesController = moduleRef.get<PrioritiesController>(PrioritiesController);
  });

  describe('getAll', () => {
    it('should return an array of priorities', async () => {
      let result: Promise<{
        id: number;
        name: string;
      }[]>;
      jest.spyOn(prioritiesService, 'getAll').mockImplementation(() => result);

      expect(await prioritiesController.getAll()).toBe(result);
    })
  })
})