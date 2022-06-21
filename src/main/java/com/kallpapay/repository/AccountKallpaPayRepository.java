package com.kallpapay.repository;

import com.kallpapay.domain.AccountKallpaPay;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AccountKallpaPay entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountKallpaPayRepository extends JpaRepository<AccountKallpaPay, Long> {}
