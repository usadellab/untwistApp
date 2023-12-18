# The location of Achraf's data
#/mnt/data/achraf/sequenced_samples/runs/pipe_20210803_UNTWIST/013_gathervcfs_UNT_check_all_reseq

#gzip -k NC_all_gatk_UNT_check_all_reseq.vcf 
#mv NC_all_gatk_UNT_check_all_reseq.vcf.gz 
#bcftools view --threads 20 -S vcfList.txt -Oz -o UNT54.OctRel.bam.vcf.merged2.UntApp.gz NC_all_gatk_UNT_check_all_reseq.vcf.gz

echo 'Number of raw variants'
zcat UNT54.OctRel.bam.vcf.merged2.UntApp.gz | grep -v '#' | wc -l

echo 'Number of variants after DP filtering >= 3'
bcftools view --types snps -i 'FORMAT/DP >= 3' -o UNT54.OctRel.bam.vcf.merged2.UntApp.DP.gz -O z UNT54.OctRel.bam.vcf.merged2.UntApp.gz --threads 4
zcat UNT54.OctRel.bam.vcf.merged2.UntApp.DP.gz | grep -v '#' | wc -l


echo 'Number of variants after quality filtering >= 20'
bcftools view --types snps -i 'QUAL >= 20' -o UNT54.OctRel.bam.vcf.merged2.UntApp.QUAL.gz -O z UNT54.OctRel.bam.vcf.merged2.UntApp.DP.gz --threads 4
zcat UNT54.OctRel.bam.vcf.merged2.UntApp.QUAL.gz | grep -v '#' | wc -l


echo 'Number of variants after genotype missingness per SNP < 20%'
bcftools view --types snps -i 'F_MISSING < 0.2' -o UNT54.OctRel.bam.vcf.merged2.UntApp.F_MISS.gz -O z UNT54.OctRel.bam.vcf.merged2.UntApp.QUAL.gz --threads 4
zcat UNT54.OctRel.bam.vcf.merged2.UntApp.F_MISS.gz | grep -v '#' | wc -l

echo 'Number of variants after MAF filter of >= 0.05'

bcftools view --types snps -i 'MAF >= 0.05' -o UNT54.OctRel.bam.vcf.merged2.UntApp.MAF.gz -O z UNT54.OctRel.bam.vcf.merged2.UntApp.F_MISS.gz --threads 4
zcat UNT54.OctRel.bam.vcf.merged2.UntApp.MAF.gz | grep -v '#' | wc -l

echo 'Renaming samples'
bcftools reheader --samples sample_mapping.txt UNT54.OctRel.bam.vcf.merged2.UntApp.MAF.gz -o UNT54.SamplesRenamed.vcf.gz

echo 'Renaming chromosomes'
bcftools annotate --rename-chrs chr_name_conv.txt UNT54.SamplesRenamed.vcf.gz -Oz -o UNT54.ChrRenamed.vcf.gz 

echo 'Make bed keep only biallelic, set half calls to ref allele, remove duplicates'
plink2 --no-sex --allow-extra-chr --chr 1-20 --vcf  UNT54.ChrRenamed.vcf.gz --set-all-var-ids '@_#_$r_$a' --make-bed --out plink --vcf-half-call 'r' --max-alleles 2 --rm-dup


echo 'Number of variants after all above filters'
wc -l plink.bim
