# GWAS data sets hosted on this page


## 1. Phenotype Datasets

### 1.1 Camelina
    The phenotypic data used for this app is taken from [https://github.com/usadellab/untwist-db/tree/main/data](https://github.com/usadellab/untwist-db/tree/main/data)

    
### 1.2 Brassica

## 2. Genotype Datasets

### 2.1 Camelina

54 accessions comprise this data set. 
For details on the source of this data please refer to 

[https://github.com/usadellab/Lab_Book_Ata/blob/master/variant_calling_with_octopus.md](https://github.com/usadellab/Lab_Book_Ata/blob/master/variant_calling_with_octopus.md)


### Starting data

The vcf files locate at the following directory were used as starting point for this data set

 ```sh
/mnt/data/ata/UNTWIST_NEW/scripts/vcfRelax/
```

The list of samples included from different sequencing runs is as follows 

```
vcfRelax/UNT_001_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_002_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_003_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_004_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_005_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_006_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_007_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_008_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_009_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_010_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_011_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_012_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_013_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_014_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_015_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_016_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_017_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_018_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_019_new_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_020_new_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_021_new_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_022_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_023_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_024_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_025_new_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_026_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_027_new_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_028_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_029_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_030_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_031_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_032_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_033_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_034_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_035_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_037_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_038_new_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_039_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_040_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_042_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_043_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_044_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_045_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_046_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_047_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_050_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_052_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_053_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_054_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_055_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_056_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_057_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_058_reseq_aor-readgroups_out.bam.vcf.gz
vcfRelax/UNT_059_reseq_aor-readgroups_out.bam.vcf.gz
```

### Merging 

```sh
bin/bash
### project name
#$ -N OctMergeUntApp

### output folder for log files
#$ -o /mnt/data/ata/UNTWIST_NEW/logs/octopus/

### combine output/error message into one file
#$ -j y

### current working directory
#$ -cwd

### number of cores to be used
#$ -pe smp 20

### memory requirement for this job
#$ -l h_vmem=4g

### Redirect to run on spike (another option -P LowPriority.p, BigMem.p, Test.p or just leave out for default queue)
###$ -P Test.p

## script

/mnt/bin/bcftools/bcftools-1.9/bin/bcftools merge --merge all -l vcfListMergedForApp.txt -Oz -o ../vcfRelax/UNT54.OctRel.bam.vcf.merged2.UntApp.gz --threads {NSLOTS}

```

### Filtering 

```sh
bcftools view --types snps -i 'MAF >= 0.05' -i 'F_MISSING < 0.1' -i 'QUAL >= 20' -i 'FORMAT/DP >= 3' -o UNT54.App.Clean.gz -O z UNT54.OctRel.bam.vcf.merged2.UntApp.gz --threads 30

```

### Renaming Sample

```sh
bcftools reheader --samples sample_mapping.txt UNT54.App.Clean.gz -o UNT54.App.CleanRenamed.gz

```

### Formatting for plink1.07 (vcf to plink format)

Plink1.07 requires 
    the chromosomes names to be the numbers like 1,2,3 .. but also allows for strings 
    each SNP record should have an id
    no duplicate records are allowed
    



```sh
bcftools annotate --rename-chrs chr_name_conv.txt UNT54.App.CleanRenamed.gz -Oz -o UNT54_chr.gz 

plink2 --no-sex --allow-extra-chr --chr 1-20 --vcf  UNT54_chr.gz --set-all-var-ids '@_#_$r_$a' --make-bed --out plink --vcf-half-call 'r' --max-alleles 2 --rm-dup

--vcf-half-call 'r' :   'reference'/'r': Treat the missing part as reference
--allow-extra-chr   :   allows for contigs 

```


```
Plink2 log is below 


PLINK v2.00a3 64-bit (17 Feb 2020)             www.cog-genomics.org/plink/2.0/
(C) 2005-2020 Shaun Purcell, Christopher Chang   GNU General Public License v3
Logging to plink.log.
Options in effect:
  --allow-extra-chr
  --chr 1-20
  --make-bed
  --max-alleles 2
  --no-sex
  --out plink
  --rm-dup
  --set-all-var-ids @_#_$r_$a
  --vcf UNT54_chr.gz
  --vcf-half-call r

Start time: Wed Aug  9 16:50:06 2023
128625 MiB RAM detected; reserving 64312 MiB for main workspace.
Using up to 32 threads (change this with --threads).
--vcf: 3871915 variants scanned (169982 skipped).
--vcf: plink-temporary.pgen + plink-temporary.pvar + plink-temporary.psam
written.
54 samples (0 females, 0 males, 54 ambiguous; 54 founders) loaded from
plink-temporary.psam.
3783751 out of 3871915 variants loaded from plink-temporary.pvar.
Note: No phenotype data present.
Note: Skipping --rm-dup since no duplicate IDs are present.
3783751 variants remaining after main filters.
Writing plink.fam ... done.
Writing plink.bim ... done.
Writing plink.bed ... done.
End time: Wed Aug  9 16:50:14 2023



```

For population stratification precomputed the following 

    1. genome file (same version plink 1.07)

    created using the following command

```sh
    ./plink-1.07-x86_64/plink --noweb --bfile plink --genome --allow-no-sex

```

```
    The out put of the above command is plink.genome. log is here pasted 
    
    @----------------------------------------------------------@
    |        PLINK!       |     v1.07      |   10/Aug/2009     |
    |----------------------------------------------------------|
    |  (C) 2009 Shaun Purcell, GNU General Public License, v2  |
    |----------------------------------------------------------|
    |  For documentation, citation & bug-report instructions:  |
    |        http://pngu.mgh.harvard.edu/purcell/plink/        |
    @----------------------------------------------------------@

    Skipping web check... [ --noweb ] 
    Writing this text to log file [ plink.log ]
    Analysis started: Wed Aug  9 16:38:09 2023

    Options in effect:
        --noweb
        --bfile plink
        --genome
        --allow-no-sex

    Reading map (extended format) from [ plink.bim ] 
    3783751 markers to be included from [ plink.bim ]
    Reading pedigree information from [ plink.fam ] 
    54 individuals read from [ plink.fam ] 
    54 individuals with nonmissing phenotypes
    Assuming a quantitative trait
    Missing phenotype value is -9
    0 males, 0 females, and 54 of unspecified sex
    Warning, found 54 individuals with ambiguous sex codes
    Writing list of these individuals to [ plink.nosex ]
    Reading genotype bitfile from [ plink.bed ] 
    Detected that binary PED file is v1.00 SNP-major mode
    Before frequency and genotyping pruning, there are 3783751 SNPs
    54 founders and 0 non-founders found
    Total genotyping rate in remaining individuals is 0.286699
    0 SNPs failed missingness test ( GENO > 1 )
    0 SNPs failed frequency test ( MAF < 0 )
    After frequency and genotyping pruning, there are 3783751 SNPs
    After filtering, 54 individuals with non-missing status
    After filtering, 0 males, 0 females, and 54 of unspecified sex
    Converting data to Individual-major format
    Writing whole genome IBS/IBD information to [ plink.genome ] 
    Filtering output to include pairs with ( 0 <= PI-HAT <= 1 )
    IBD(g) calculation: 1400 of 1431                  

    Analysis finished: Wed Aug  9 16:40:06 2023
```


    2. pca analysis

    precomputed eigenvectors for GWAS analysis 

    ```sh
        plink --bfile plink --pca 2 --out pca    (i used plink 1.9 for this)

    ```
```
Plink1.9 PCA log is below 

PLINK v1.90b7 64-bit (16 Jan 2023)             www.cog-genomics.org/plink/1.9/
(C) 2005-2023 Shaun Purcell, Christopher Chang   GNU General Public License v3
Logging to pca.log.
Options in effect:
  --bfile plink
  --out pca
  --pca 2

128625 MB RAM detected; reserving 64312 MB for main workspace.
3783751 variants loaded from .bim file.
54 people (0 males, 0 females, 54 ambiguous) loaded from .fam.
Ambiguous sex IDs written to pca.nosex .
Using up to 31 threads (change this with --threads).
Before main variant filters, 54 founders and 0 nonfounders present.
Calculating allele frequencies... done.
Total genotyping rate is 0.286699.
3783751 variants and 54 people pass filters and QC.
Note: No phenotypes present.
Relationship matrix calculation complete.
--pca: Results saved to pca.eigenval and pca.eigenvec .



```

### 2.2 Brassica


