import { prisma } from '../../config/prisma.js';
import { HttpError } from '../../core/utils/errors.js';
import { JobCreateInput, JobUpdateInput, ListQueryInput } from './schemas.js';

export async function createJob(input: JobCreateInput) {
  return prisma.jobVacancy.create({
    data: {
      ...input,
      targetMajors: JSON.stringify(input.targetMajors),
      requirements: JSON.stringify(input.requirements),
    },
  });
}

export async function getJob(id: string) {
  const job = await prisma.jobVacancy.findUnique({ where: { id } });
  if (!job) throw HttpError.notFound('Lowongan tidak ditemukan');
  return {
    ...job,
    targetMajors: JSON.parse(job.targetMajors),
    requirements: JSON.parse(job.requirements),
  };
}

export async function listJobs(query: ListQueryInput) {
  const { page, limit, type, location, targetMajor, isActive, isBkkPartner, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (type) where.type = type;
  if (location) where.location = { contains: location };
  if (targetMajor) where.targetMajors = { contains: targetMajor };
  if (isActive !== undefined) where.isActive = isActive;
  if (isBkkPartner !== undefined) where.isBkkPartner = isBkkPartner;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { company: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.jobVacancy.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.jobVacancy.count({ where }),
  ]);

  return {
    data: data.map((j) => ({
      ...j,
      targetMajors: JSON.parse(j.targetMajors),
      requirements: JSON.parse(j.requirements),
    })),
    total,
    page,
    limit,
  };
}

export async function updateJob(id: string, input: JobUpdateInput) {
  await getJob(id);

  const data: Record<string, unknown> = { ...input };
  if (input.targetMajors) data.targetMajors = JSON.stringify(input.targetMajors);
  if (input.requirements) data.requirements = JSON.stringify(input.requirements);

  return prisma.jobVacancy.update({
    where: { id },
    data,
  });
}

export async function deleteJob(id: string) {
  await getJob(id);
  await prisma.jobVacancy.delete({ where: { id } });
  return { success: true };
}